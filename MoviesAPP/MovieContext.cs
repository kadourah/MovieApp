using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.Entity;
using MoviesAPP.Models;

namespace MoviesAPP
{
    public class MovieContext : System.Data.Entity.DbContext
    {

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            Database.SetInitializer<MovieContext>(null);
            base.OnModelCreating(modelBuilder);
        }
        public MovieContext() : base("MoviesConnectionString") { }
        public DbSet<Movie> Movies { get; set; }
    }
}
    