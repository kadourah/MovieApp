using Microsoft.Owin;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.Jwt;
//using Microsoft.Owin;
//using Microsoft.Owin.Security;
//using Microsoft.Owin.Security.Jwt;
using Owin;
using System.Configuration;
using System.IdentityModel.Tokens;
using Auth0.Owin;
using System.Web.Http;
//using System.IdentityModel.Claims;
//using System.Threading.Tasks;

namespace MoviesAPP
{
    public partial class Startup
    {
        public void ConfigureAuth(IAppBuilder app)
        {
            HttpConfiguration config = new HttpConfiguration();
            //ConfigureAuthZeroWithRedirect(app);
            ConfigureAuthZero(app);
            //  WebApiConfig.Register(config);

            //app.UseCors(Microsoft.Owin.Cors.CorsOptions.AllowAll);
            app.UseWebApi(config);

        }

        public void ConfigureAuthZero(IAppBuilder app)
        {
            // Configure Auth0 parameters
            // var auth0Domain = $"https://{ConfigurationManager.AppSettings["Domain"]}/";
            string auth0Domain = ConfigurationManager.AppSettings["auth0:Domain"];
            string auth0ClientId = ConfigurationManager.AppSettings["auth0:ClientId"];
            string auth0ClientSecret = ConfigurationManager.AppSettings["auth0:ClientSecret"];
            string apiIdentifier = ConfigurationManager.AppSettings["auth0:Auth0ApiIdentifier"];

            var keyResolver = new OpenIdConnectSigningKeyResolver(auth0Domain);
            app.UseJwtBearerAuthentication(
                new JwtBearerAuthenticationOptions
                {
                    AuthenticationMode = AuthenticationMode.Active,



                    TokenValidationParameters = new TokenValidationParameters()
                    {
                        ValidAudience = apiIdentifier,
                        ValidIssuer = auth0Domain,
                        IssuerSigningKeyResolver = (token, securityToken, identifier, parameters) => keyResolver.GetSigningKey(identifier)
                    }
                });
           

        }
    }
}