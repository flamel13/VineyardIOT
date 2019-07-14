const mongoose = require('mongoose');
const passport = require('passport');
const router = require('express').Router();
const auth = require('../auth');
// BigchainDB driver
const BigchainDB = require('bigchaindb-driver');
// Library that generates keypair from a seed
const bip39 = require('bip39');
const crypto = require('crypto');
const Users = mongoose.model('Users');

//POST new user route (optional, everyone has access)
router.post('/', auth.optional, (req, res, next) => {
  const { body: { user } } = req;

  console.log(user);
  
  if(!user.email) {
    return res.status(422).json({
      errors: {
        email: 'is required',
      },
    });
  }

  if(!user.password) {
    return res.status(422).json({
      errors: {
        password: 'is required',
      },
    });
  }

    // what you describe as 'seed'
  var randomBytes = crypto.randomBytes(16); // 128 bits is enough
  // your 12 word phrase
  var mnemonic = bip39.entropyToMnemonic(randomBytes.toString('hex'));
  // what is accurately described as the wallet seed
  var seed;
  bip39.mnemonicToSeed(mnemonic).then(temp_seed => {
    seed = temp_seed.slice(0,32);
  })
  const user_temp_keys = new BigchainDB.Ed25519Keypair(seed);

  user.privkey = user_temp_keys.privateKey;
  user.pubkey = user_temp_keys.publicKey;

  const finalUser = new Users(user);

  finalUser.setPassword(user.password);

  return finalUser.save()
    .then(() => res.json({ user: finalUser.toAuthJSON() }));
});

//POST login route (optional, everyone has access)
router.post('/login', auth.optional, (req, res, next) => {
  const { body: { user } } = req;

  if(!user.email) {
    return res.status(422).json({
      errors: {
        email: 'is required',
      },
    });
  }

  if(!user.password) {
    return res.status(422).json({
      errors: {
        password: 'is required',
      },
    });
  }

  return passport.authenticate('local', { session: false }, (err, passportUser, info) => {
    if(err) {
      return next(err);
    }

    if(passportUser) {
      const user = passportUser;
      user.token = passportUser.generateJWT();

      return res.json({ user: user.toAuthJSON() });
    }

    return status(400).info;
  })(req, res, next);
});

//GET current route (required, only authenticated users have access)
router.get('/current', auth.required, (req, res, next) => {
  const { payload: { id } } = req;

  return Users.findById(id)
    .then((user) => {
      if(!user) {
        return res.sendStatus(400);
      }

      return res.json({ user: user.toAuthJSON() });
    });
});

module.exports = router;
