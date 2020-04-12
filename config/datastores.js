module.exports.datastores = {
    default: {
        adapter: require('sails-postgresql'),
        url: `postgresql://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOSTNAME}:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DATABASE}`
    },
};
  
console.log(`postgresql://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOSTNAME}:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DATABASE}`)