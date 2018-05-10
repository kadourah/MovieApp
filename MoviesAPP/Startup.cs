using System.Configuration;
using System.IdentityModel.Tokens;
using System.Security.Cryptography.X509Certificates;
using System.Web.Hosting;
using Microsoft.Owin;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.Jwt;
using Owin;

[assembly: OwinStartup(typeof(MoviesApp.Startup))]

namespace MoviesApp
{
    public partial class Startup
    {
        

        public void Configuration(IAppBuilder app)
        {
            var domain = $"https://{ConfigurationManager.AppSettings["auth0:Domain"]}/";
            var apiIdentifier = ConfigurationManager.AppSettings["auth0:Auth0ApiIdentifier"];

            string certificatePath = HostingEnvironment.MapPath("~/kadourah.cer");
            var certificate = new X509Certificate2(certificatePath);

            app.UseJwtBearerAuthentication(
                new JwtBearerAuthenticationOptions
                {
                    AuthenticationMode = AuthenticationMode.Active,
                    TokenValidationParameters = new TokenValidationParameters()
                    {
                        ValidAudience = apiIdentifier,
                        ValidIssuer = domain,
                        IssuerSigningKeyResolver = (a, b, c, d) => new X509SecurityKey(certificate),
                    }
                });

            // Configure Web API
            MoviesAPP.WebApiConfig.Configure(app);
        }
    }
}
