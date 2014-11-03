/**
 * Module Dependencies
 */

var mongoose = require('mongoose')
  , bcrypt   = require('bcrypt')
  , Schema   = mongoose.Schema;

var config   = require('../config');

var bcryptSettings = config.bcryptSettings;

/**
 * Define employer schema
 */

var employerSchema = new Schema({
    companyName:   { type: String, required: true } 
  , credentials: {
        password:  { type: String, required: true }
      , email:     { type: String, required: true }
    }
  , contact: {
        website:   { type: String }
      , linkedIn:  { type: String }
      , facebook:  { type: String }
      , twitter:   { type: String }
      , phoneNum:  { type: String }
    }
  , location: {
        city:      { type: String, required: true }
      , state:     { type: String, required: true }
      , zip:       { type: String, required: true }
      , address1:  { type: String, required: true }
      , address2:  { type: String }
      , country:   { type: String, required: true }
    }
  , personal: {
        fName:     { type: String, required: true }
      , mInit:     { type: String }
      , lName:     { type: String, required: true }
    }
}); 

/**
 * Set pre-save hook for replacing password field
 * with its hashed version
 */

employerSchema.pre('save', function(next){
    var employer = this;
    
    // Make sure model has not been saved before, else
    // we might end up hashing the password twice
    if (!employer.isNew)
        return next(new Error("Can't save same model twice. Password has been hashed already!"));
    
    // Create a SALT
    bcrypt.genSalt(bcryptSettings.hashRounds, function(err, salt){
        if(err) return next(err);
        // Hash password
        bcrypt.hash(employer.credentials.password, salt, function(err, hashedPassword){
            if(err) return next(err);
            // Overwrite plain text password with hashed version
            employer.credentials.password = hashedPassword;
            next();
        });
    });
});

/**
 * Finds an employer with the given credentials.
 * Returns true if the employer exists
 * Password is expected to be in plain text
 * @param creds {Object} employer credentials
 * @param cb {Function} callback 
 * @return {Bool} applicant exists
 * creds {
 *     password: {String}
 *   , email   : {String}
 * }
 */
employerSchema.static('exists', function(creds,cb){
    var employer = this;
    // Look for employer with the given email
    employer.findOne({'credentials.email' : creds.email}, function(err, employer){
        if (err) return cb(err);
        // Compare employer password hash with given credentials
        bcrypt.compare(creds.password, employer.credentials.password, function(err, res){
            if (err) return cb(err);
            // res is true if passwords matched
            cb(null, res);
        });
    });
});
/**
 * Export schema
 */

exports = module.exports = employerSchema; 
