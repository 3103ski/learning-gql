const express = require('express');
const mongoose = require('mongoose');
const { ApolloServer, PubSub } = require('apollo-server-express');

const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');

const { MONGODB } = require('./config');

const pubsub = new PubSub();

const server = new ApolloServer({
	typeDefs,
	resolvers,
	context: ({ req }) => ({ req, pubsub }),
});

const app = express();

server.applyMiddleware({ app });

mongoose
	.connect(MONGODB, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => {
		console.log('MongoDB Connected!');
		return app.listen({ port: 5000 });
	})
	.then(() => console.log(`🚀 Server ready at http://localhost:5000${server.graphqlPath}`));
