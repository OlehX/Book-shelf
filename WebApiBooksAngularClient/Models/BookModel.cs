using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace WebApiPagingAngularClient.Models
{
    public class BookModel
    {
        [Required]
        [Display(Name = "Name")]
        public string Name { get; set; }
        [Required]
        [Display(Name = "Image")]
        public string Image { get; set; }
        [Required]
        [Display(Name = "Description")]
        public string Description { get; set; }
        [Required]
        [Display(Name = "File")]
        public string File { get; set; }
        [Required]
        [Display(Name = "Authors")]
        public List<Author> Authors{get;set; }
    }
}