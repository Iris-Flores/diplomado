export default function notFound(req, res, next){
    res.status(400).json({ message: 'Not found'});
}