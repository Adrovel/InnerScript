/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['sequelize', 'pg', 'pg-hstore', 'pg-native'],
}

export default nextConfig
