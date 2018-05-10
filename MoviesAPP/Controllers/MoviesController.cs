using MoviesAPP.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace MoviesAPP.Controllers
{
    [RoutePrefix("api/movies")]
    public class MoviesController : System.Web.Http.ApiController
    {
        [HttpGet]
        [Route("GetAll")]
        [Authorize]
        public IHttpActionResult Get()
        {
            MovieContext context = new MovieContext();
            var q = (from i in context.Movies
                     select i).AsQueryable();

            //return q;

            return Json(q);
            
        }

        [HttpPost]
        [ScopeAuthorize("write:messages")]
        public void Post(Movie value)
        {
            MovieContext context = new MovieContext();
            context.Movies.Add(new Movie()
            {
                Id = Guid.NewGuid(),
                Name = value.Name,
                DateCreated = DateTime.Now,
                DateUpdated = DateTime.Now
            });
            context.SaveChanges();

            //return context.Movies.ToList();

        }



        [HttpDelete]
        [ScopeAuthorize("delete:messages")]
        public void Delete(string id)
        {
            MovieContext context = new MovieContext();
            var guid = Guid.Parse(id);
            var q = (from i in context.Movies
                     where i.Id == guid
                     select i).FirstOrDefault();

            if (null != q) context.Movies.Remove(q);

            context.SaveChanges();

        }
    }
}