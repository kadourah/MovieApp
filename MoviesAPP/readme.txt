*This example showcase the following Auth0 features: 
- Using Jquery with Auth0
- Securing ASP.NET web API using Owin
- Utilizing scopes to secure api calls
- There are also rules which have been implemented on the Auth0 side

Prereq:
 - Visual Studio 2015
 - SQL Express 2012
 
 using the solution:
 1. You will need to download your Auth0 certificate from your dashboard: https://auth0.com/docs/connector/client-certificates , this is necessary to establish communicatiton with apis
 2. fill in the web.config parameters:
 auth0:ClientId
 auth0:Domain
 auth0:Auth0ApiIdentifier
 
Notes:
1. Each api is attributed with a scope which limits the access by the user
2. we have used owin to authenticate and work with Auth0
3. We have use Auth0 jquery library to get the JWT token