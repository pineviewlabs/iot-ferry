# R Shiny library (powering the interactive full-stack web application)
library(shiny)
# Leaflet library used to visualize the map
library(leaflet)

# Shiny UI (in this case — just the full-screen leaflet map)
ui <- fluidPage(tags$style(type = "text/css", "#map {height: 100vh !important;}"),leafletOutput("map"))

# Shiny server code (logic)
server <- function(input, output, session) {
  # Path/name of a CSV file with ferry positions
  points_file_name = "/tmp/shiny-data/points.csv"
  
  # Dynamic polling for a CSV file contents
  # Positions are stored as a data.frame
  points <- reactivePoll(
    # Poll each second (1000 ms) for a changes
    1000,
    session,
    # Function to check whether the file modification time has changed
    # To avoid reload the file if it has not been changed
    checkFunc = function() {
      if (file.exists(points_file_name))
        file.info(points_file_name)$mtime[1]
      else
        ""
    },
    # Function to read the file contents
    valueFunc = function() {
      if (file.exists(points_file_name))
        read.csv(points_file_name)
      else
        data.frame(lat = c(),
                   lng = c(),)
    }
  )
  
  # Render the map into the Shiny UI element
  output$map <- renderLeaflet({
    # The map itself
    leaflet() %>%
      # The map tiles (see https://rstudio.github.io/leaflet/basemaps.html)
      addProviderTiles(providers$Stamen.TonerLite,
                       options = providerTileOptions(noWrap = TRUE)) %>%
      # Starting map lat/lng bounds (hard-coded, don't do that in production code)
      fitBounds(10, 40, 15, 50)
  })
  
  # Observer which will be triggered when any reactive dependency changes
  # In this particular case the only dependency is the points data frame
  observe({
    pts <- points()
    # This is the way to tell leaflet to apply changes to an already created map
    leafletProxy("map", data = data.matrix(pts)) %>%
      # Change map lat/lng bounds to contain the full trajectory
      fitBounds(min(pts$lat), min(pts$lng), max(pts$lat), max(pts$lng)) %>%
      # Remove all the points / lines
      clearShapes() %>%
      # Add the points (which are actually small circles)
      addCircles(color = "green", weight = 2) %>%
      # Add the trajectory lines
      addPolylines(weight = 0.9)
  })
}

# Start the R Shiny application
shinyApp(ui, server)