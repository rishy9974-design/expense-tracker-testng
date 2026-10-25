EXPENSE TRACKER - COMMANDS

1. Start the application server:
python3 -m http.server 8080 --directory app

2. Run TestNG tests using Maven:
mvn clean test "-DsuiteXmlFile=testng.xml"

NOTE:
- Run these commands from the project folder.
- Keep the server running while testing if required.
- Open http://localhost:8080 in your browser.
