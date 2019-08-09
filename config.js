module.exports = {
    stringParameters: {
        start: '{{',
        end: '}}'
    },
    musicServices: {
        spotify: {
            accessTokenExpiration: 1000 * 60 * 59, //59 minutes
            serverPort: 12345,
            chunkOptions: {
                chunkSize: 50,
                parallelAsyncChunks: 1,
                errorHandlingOptions: {
                    retries: 3,
                    throwError: true
                }
            }
        }
    },
    mongo: {
        uri: 'mongodb://localhost:27017',
        dbName: 'tracks',
        collection: 'tracks'
    }
}