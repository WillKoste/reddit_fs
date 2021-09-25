import express from 'express';
const router = express.Router();

router.get('/', (_, res) => {
	try {
		res.send('Hey boo');
	} catch (err) {
		console.error(err);
		res.status(500).json({success: false, data: 'Server Error'});
	}
});

export default router;
