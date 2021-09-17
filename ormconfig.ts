const _dbURL =
  process.env.DATABASE_URL ||
  'postgres://postgres:admin@localhost:5432/postgres';

const _chunks = _dbURL.split(':');
const [_port, _databaseName] = _chunks[3].split('/');
const [_password, _host] = _chunks[2].split('@');
const _username = _chunks[1].split('//')[1];

function _config(): Record<string, any> {
  const ssl =
    process.env.DATABASE_URL != null
      ? {
          ssl: {
            rejectUnauthorized: false,
          },
        }
      : {};
  return {
    type: 'postgres',
    port: _port,
    host: _host,
    database: _databaseName,
    username: _username,
    password: _password,
    synchronize: true,
    entities: ['dist/**/*.entity.js'],
    migrations: ['dist/migrations/*.js'],
    cli: {
      migrationsDir: 'migrations',
    },
    extra: {
      ...ssl,
    },
  };
}

const _configMap = _config();
export default _configMap;
