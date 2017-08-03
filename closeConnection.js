//exported common function for closing the db connection that can be used in all other modules

exports.closeConnection = (connection) => {
        connection.end();
}

