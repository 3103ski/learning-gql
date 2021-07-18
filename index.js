const express = require('express');
const mongoose = require('mongoose');
const { ApolloServer, PubSub } = require('apollo-server-express');

const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');

const { MONGODB } = require('./config');

const pubsub = new PubSub();

const PORT = process.env.port || 5000;

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
		return app.listen({ port: PORT });
	})
	.then(() => console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`))
	.catch((err) => {
		console.log.error(err);
	});
