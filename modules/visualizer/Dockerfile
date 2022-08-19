# Base image for this container
FROM rocker/shiny:4.2.1

# Install dependencies
RUN R -e 'install.packages(c(\
  "shinyjs", \
  "leaflet" \
  ) \
  )'

# Remove all the Rocker example project files
RUN rm -rf /srv/shiny-server/**
# Copy application files into the container
COPY ./app.R /srv/shiny-server/