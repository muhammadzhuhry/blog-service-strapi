module.exports = shipit => {

    require('shipit-deploy')(shipit)

    shipit.initConfig({
        default: {
            servers: [{
                host: '152.42.202.140',
                user: 'root',
            }],
        },
        prod: {
            servers: [{
                host: '152.42.202.140',
                user: 'root',
            }]
        },
    });

    shipit.task('deploy', async function () {
        const git = "https://github.com/muhammadzhuhry/blog-service-strapi.git";
        const dir = "strapi";

        await shipit.remote(`mkdir ~/${dir}`);
        await shipit.remote(`cd ~/${dir} && git clone ${git} .`);
        await shipit.remote(`cd ~/${dir} && git pull ${git}`);
        await shipit.remote(`cd ~/${dir} && cp .env.prod .env`);
        await shipit.remote(`cd ~/${dir} && npm install`);
        await shipit.remote(`cd ~/${dir} && npm run build`);
        // this command using for the first time start using pm2
        await shipit.remote(`cd ~/${dir} && pm2 start yarn --name strapi -- start`);
        // this command for restart using if u have already start
        // await shipit.remote(`cd ~/${dir} && pm2 restart strapi`);
        await shipit.remote(`cd ~/${dir} && caddy run --config ./Caddyfile`);
        await shipit.remote(`cd ~/${dir} && caddy fmt --overwrite`);
        // this command for reload caddyfile if have changes
        // await shipit.remote(`cd ~/${dir} && caddy reload --config ./Caddyfile`);
    });

};