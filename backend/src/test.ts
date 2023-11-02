import express from 'express';

const app = express();

app.use((req: express.Request<{}, {}, { user: any }>, res, next) => {
	req.user = { id: 1, username: 'test' };
	next();
});

app.get('/', (req, res) => {
	if (req.user) {
		res.send(`User ID: ${req.user.id}`);
	} else {
		res.send('No user found');
	}
});

app.listen(3000, () => {
	console.log('Server is running on port 3000');
});
