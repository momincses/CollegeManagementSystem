const router = express.Router();

router.post('/events/:eventId/expenditures', upload.single('receipt'), addExpenditure);
router.get('/events/:eventId/expenditures', getEventExpenditures); 