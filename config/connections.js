/**
 * Connections
 * (sails.config.connections)
 *
 * `Connections` are like "saved settings" for your adapters.  What's the difference between
 * a connection and an adapter, you might ask?  An adapter (e.g. `sails-mysql`) is generic--
 * it needs some additional information to work (e.g. your database host, password, user, etc.)
 * A `connection` is that additional information.
 *
 * Each model must have a `connection` property (a string) which is references the name of one
 * of these connections.  If it doesn't, the default `connection` configured in `config/models.js`
 * will be applied.  Of course, a connection can (and usually is) shared by multiple models.
 * .
 * Note: If you're using version control, you should put your passwords/api keys
 * in `config/local.js`, environment variables, or use another strategy.
 * (this is to prevent you inadvertently sensitive credentials up to your repository.)
 *
 * For more information on configuration, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.connections.html
 */

 module.exports.connections = {

  /***************************************************************************
  *                                                                          *
  * PostgreSQL is another officially supported relational database.          *
  * http://en.wikipedia.org/wiki/PostgreSQL                                  *
  *                                                                          *
  * Run: npm install sails-postgresql                                        *
  *                                                                          *
  *                                                                          *
  ***************************************************************************/
  postgresqlServer: {
    adapter: 'sails-postgresql',
    host: process.env.POSTGRES_HOSTNAME,
    user:  process.env.POSTGRES_USER,
    password:  process.env.POSTGRES_PASSWORD,
    database:  process.env.POSTGRES_DATABASE,
    port: process.env.POSTGRES_PORT,
    poolSize: 5,
    ssl: true
  },

redis: {
    adapter: 'redis',
   port: process.env.REDIS_SNAKES_PORT,
   host: process.env.REDIS_SNAKES_HOSTNAME,
   password:process.env.REDIS_SNAKES_PASSWORD,
   //database: process.env.REDIS_SNAKES_DATABASE,
   //user: process.env.AZURE_REDIS_SNAKES_USER,
   options: {

    // low-level configuration
    // (redis driver options)
    parser: 'hiredis',
    return_buffers: false,
    detect_buffers: false,
    socket_nodelay: true,
    no_ready_check: false,
    enable_offline_queue: true
  }
},

  postgresqlServer_dev: {
    adapter: 'sails-postgresql',
    host: process.env.POSTGRES_SNAKES_HOSTNAME,
    user:  process.env.POSTGRES_SNAKES_USER,
    password:  process.env.POSTGRES_SNAKES_PASSWORD,
    database:  process.env.POSTGRES_SNAKES_DATABASE,
    port: process.env.POSTGRES_SNAKES_PORT,
    poolSize: 2
  }
}
