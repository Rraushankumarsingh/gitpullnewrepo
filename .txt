

// main branch
const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const md5 = require('md5');

const app = express();
const port = 3000;
const uri = 'mongodb://127.0.0.1:27017'; 
const dbName = 'testdb';



const usersData = [
    { firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', password: 'password123' },
    { firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@example.com', password: 'password456' },
    { firstName: 'Alice', lastName: 'Johnson', email: 'alice.johnson@example.com', password: 'password789' },
    { firstName: 'Bob', lastName: 'Brown', email: 'bob.brown@example.com', password: 'password101' },
    { firstName: 'Charlie', lastName: 'Davis', email: 'charlie.davis@example.com', password: 'password202' }
];

const usersProfileData = [
    { dob: '1990-01-01', mobileNo: '1234567890' },
    { dob: '1985-05-15', mobileNo: '2345678901' },
    { dob: '1992-07-21', mobileNo: '3456789012' },
    { dob: '1988-11-30', mobileNo: '4567890123' },
    { dob: '1995-03-14', mobileNo: '5678901234' }
];

const main = async () => {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();
        console.log('Connected to database');

        const db = client.db(dbName);
        const usersCollection = db.collection('Users');
        const usersProfileCollection = db.collection('UsersProfile');

        
        for (let i = 0; i < usersData.length; i++) {
            const user = usersData[i];
            user.password = md5(user.password); 

           
            const userResult = await usersCollection.insertOne({
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                password: user.password
            });

            
            const userProfile = usersProfileData[i];
            await usersProfileCollection.insertOne({
                user_id: userResult.insertedId,
                dob: userProfile.dob,
                mobileNo: userProfile.mobileNo
            });
        }

        console.log('Inserted 5 users and their profiles');
    } catch (error) {
        console.error('Error connecting to database:', error);
    } finally {
        await client.close();
    }
};

main().catch(console.error);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
