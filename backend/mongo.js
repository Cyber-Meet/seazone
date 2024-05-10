const { MongoClient, ServerApiVersion } = require('mongodb');

const MongoPassword = encodeURIComponent("Seazonehotels@01");
const uri = `mongodb+srv://mravariya473:${MongoPassword}@seazone.g8az5me.mongodb.net/?retryWrites=true&w=majority`;

async function connectWithRetry() {
    const maxRetries = 5;
    let currentRetry = 0;

    while (currentRetry < maxRetries) {
        const client = new MongoClient(uri, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            }
        });

        try {
            await client.connect();
            console.log('Connected to MongoDB Atlas');
            return client;
        } catch (error) {
            console.error('Connection error:', error);

            // Increment retry count
            currentRetry += 1;

            // Wait for some time before retrying (you can adjust this)
            await new Promise(resolve => setTimeout(resolve, 5000));
        }
    }

    throw new Error('Max connection retries reached');
}

async function run() {
    try {
        const client = await connectWithRetry();

        // Perform operations using the connected client

        // Close the client when done
        await client.close();
    } catch (error) {
        console.error('Error during connection and retry:', error);
    }
}

// Run the application
run();
