module.exports = {
    stringParameters: {
        start: '{{',
        end: '}}'
    },
    musicServices: {
        spotify: {
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
    }
}