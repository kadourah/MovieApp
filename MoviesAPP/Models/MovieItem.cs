using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace MoviesAPP.Models
{
    public class Movie
    {
        public Guid Id { get; set; }

        public DateTime DateCreated { get; set; }
        public DateTime DateUpdated { get; set; }

        public string Name { get; set; }
       
        public string Description { get; set; }

    }
}