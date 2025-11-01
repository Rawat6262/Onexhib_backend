let mongoose = require('mongoose');
function Connection(url) {
    return mongoose.connect(url)

}
module.exports = Connection;