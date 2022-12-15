const consultations = require('../models/consultation')

// function sarchByRate() {
//     clientRouter.get('/users/rateSearch/:rate', async (req, res) => {
//         try {
//             const lawys = await lawyers.find({ rate: req.params.rate })
//             res.send(lawys)
//         } catch (err) {
//             res.status(400).send()
//         }
//     })
// }

// sarchByRate()


// function sarchByLawyerType() {
//     clientRouter.get('/users/Typesearch/:type', async (req, res) => {
//         try {
//             const lawys = await lawyers.find({ lawyer_type: req.params.type })
//             if (!lawys) {
//                 return res.status(404).send()
//             }
//             res.status(200).send(lawys)
//         } catch (err) {
//             res.status(400).send()
//         }
//     })
// }

// sarchByLawyerType()


// function sarchByLawyerAddress() {
//     clientRouter.get('/users/addressSearch/:address', async (req, res) => {
//         try {
//             const lawys = await lawyers.find({ address: req.params.address })
//             if (!lawys) {
//                 return res.status(404).send()
//             }
//             res.status(200).send(lawys)
//         } catch (err) {
//             res.status(400).send()
//         }
//     })
// }

// sarchByLawyerAddress()


// function generalSearch() {
//     clientRouter.get('/users/search/:town/:region/:type/:rate', async (req, res) => {
//         try {
//             const lawys = await lawyers.find({ town: req.params.town, region: req.params.region, lawyer_type: req.params.type, rate: req.params.rate })
//             if (!lawys) {
//                 return res.status(404).send()
//             }
//             res.send(lawys)
//         } catch (err) {
//             res.status(400).send()
//         }
//     })
// }

// generalSearch()


// function showReadyLawyer() {
//     clientRouter.get('/users/ready/:id', auth, async (req, res) => {
//         try {
//             const con = await consultations.findOne({ _id: req.params.id, client: req.client._id })
//             if (!con) {
//                 return res.status(404).send()
//             }
//             const readr_Lawyers = await lawyers.find({ _id: con.ready_Lawyers })
//             if (!readr_Lawyers) {
//                 return res.status(404).send()
//             }
//             res.status(200).send(readr_Lawyers)
//         } catch (err) {
//             res.status(400).send(err)
//         }
//     })
// }

// showReadyLawyer()



// function assignLawyerToCon() {
//     clientRouter.post('/users/:conID/lawyer/:id', auth, async (req, res) => {
//         try {
//             const con = await consultations.findById(req.params.conID)
//             if (con.client != req.client.id) {
//                 return res.status(401).send()
//             }
//             const lawyer = await lawyers.findById(req.params.id)
//             if (!lawyer) {
//                 return res.status(404).send()
//             }
//             lawyer.User = lawyer.User.concat({ _id: req.client._id })
//             req.client.lawyers = req.client.lawyers.concat({ _id: req.params.id })
//             lawyer.consultations = lawyer.consultations.concat({ _id: req.params.conID })
//             await lawyer.save()
//             await req.client.save()
//             res.status(200).send(lawyer)
//         } catch (err) {
//             res.status(400).send(err)
//         }
//     })
// }

// assignLawyerToCon()


// function showAssinedLawyer() {
//     clientRouter.get('/users/me/lawyers', auth, async (req, res) => {
//         try {
//             const laws = await lawyers.find({ _id: req.client.lawyers })
//             if (!laws) {
//                 return res.status(404).send()
//             }
//             res.status(200).send(laws)
//         } catch (err) {
//             res.status(404).send(err)
//         }
//     })
// }

// showAssinedLawyer()

// module.exports = clientRouter 