# R Shiny library (powering the interactive full-stack web application)
library(shiny)
# Leaflet library used to visualize the map
library(leaflet)

# Shiny UI
ui <- navbarPage(
  # Logo (ferry)
  title = div(img(class = "logo", src = "ferry.png")),
  id = "nav",
  header = tags$head(tags$link(rel = "stylesheet", type = "text/css", href = "style.css")),
  # Map page
  tabPanel(
    "Interactive map",
    icon = div(includeHTML("www/svg/icon-map.svg")),
    div(class = "main",
      div(
        class = "outer",
        leafletOutput("map", width = "100%", height = "100%")
      )
    )
  ),
  # "About" page
  tabPanel(
    "About",
    icon = div(includeHTML("www/svg/icon-about.svg")),
    div(
      class="about-page",
      h1("About: IoT Ferry Demo"),
      div(class="about-content", "TBD")
    )
  )
)

# Shiny server code (logic)
server <- function(input, output, session) {
  # Path/name of a CSV file with ferry positions
  points_file_name = "/tmp/shiny-data/route.csv"
  
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
        data.frame(lat = c(0),
                   lng = c(0))
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
      fitBounds(7.9, 57.5, 10.1, 59.1)
  })
  
  # Observer which will be triggered when any reactive dependency changes
  # In this particular case the only dependency is the points data frame
  observe({
    pts <- points()
    # This is the way to tell leaflet to apply changes to an already created map
    leafletProxy("map", data = data.matrix(pts)) %>%
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
