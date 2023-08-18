# week-18-social-network-api-challenge

Building an API where users can share thoughts and reactions which will be converted into unstructured data notably with the use of NoSQL mainly in the backend.

Technologies that are involved in this project include:

- Express for routing HTTP requests for data such as GET(grabbing data),POST(creating data),PUT(updating data) & DELETE(erasing data)
- MongoDB database
- Mongoose ODM(Object Data Models)

# Things implemented to the task of a startup social network API:

- WHEN the user starts up the application within the terminal
THEN the server will start and Mongoose models are synced to the MongoDB database
- WHEN the user opens API GET routes on an API platform for users and thoughts
THEN the data for each of these routes are displayed in a formatted JSON and is able to get back all of the users and thoughts in total or just with their ID alone
- WHEN the user tests API POST, PUT, and DELETE routes on an API platform
THEN the database can successfully create, update, and delete users and thoughts 
- WHEN the user tests API POST and DELETE routes on an API platform
THEN the user is able to successfully create and delete reactions to thoughts and add and remove friends to a user’s friend list on an API platform

