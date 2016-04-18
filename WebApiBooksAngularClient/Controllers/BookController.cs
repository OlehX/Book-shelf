using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web.Http;
using WebApiPagingAngularClient.Models;

namespace WebApiPagingAngularClient.Controllers
{
    [RoutePrefix("api/book")]
    public class BookController : ApiController
    {

        [Route("")]
        // GET: api/Book
        public IHttpActionResult Get()
        { 
            using (var db = new BooksEntities())
            {
                var boo = (
                    from b in db.Book
                    select new { Name = b.Name, Image = b.Image, Description = b.Description, File = b.File, Authors = (from a in db.Author from t in db.Table where (t.Author_id == a.Id && t.Book_id == b.Id) select a).ToList() }).ToList();
                var result = new
                {

                    Books = boo
                };
                return Ok(result);
            }
        }

        // GET: api/Book/pageSize/pageNumber/
        [Route("{pageSize:int}/{pageNumber:int}")]
        public IHttpActionResult Get( int pageSize, int pageNumber)
        {
            using (var db = new BooksEntities())
            {
                var boo = (
                    from b in db.Book
                    orderby b.Id descending
                    select new { Name = b.Name, Image = b.Image, Description = b.Description, File = b.File, Authors = (from a in db.Author from t in db.Table where (t.Author_id == a.Id && t.Book_id == b.Id) select a).ToList() }).ToList();
                var totalCount = boo.Count();
                var totalPages = Math.Ceiling((double)totalCount / pageSize);
                var elements = boo.Skip((pageNumber - 1) * pageSize)
                                   .Take(pageSize)
                                   .ToList();
                var result = new
                {
                    TotalCount = totalCount,
                    TotalPages = totalPages,
                    Books = elements
                };
                return Ok(result);
            }
        }


        // GET: api/Book/Author
        [Route("{name:minlength(0)}")]
        public IHttpActionResult Get(string name)
        {

            using (var db = new BooksEntities())
            {
                //пошук книг по автору
                var temp = (from a in db.Author
                            join t in db.Table on a.Id equals t.Author_id
                            where (a.Name + " " + a.SName).Contains(name)
                            select t);
                var auth = (
                    from b in db.Book
                    join t in temp on b.Id equals t.Book_id
                    where (b.Id == t.Book_id)
                    select new { Name = b.Name, Image = b.Image, Description = b.Description, File = b.File, Authors = (from a in db.Author from t in db.Table where (t.Author_id == a.Id && t.Book_id == b.Id) select a).ToList() }).GroupBy(n => new { n.Name }).Select(g => g.FirstOrDefault()).ToList();
                //Пошук книг по назві
                var boo = (
                  from b in db.Book
                  where b.Name.Contains(name)
                  select new { Name = b.Name, Image = b.Image, Description = b.Description, File = b.File, Authors = (from a in db.Author from t in db.Table where (t.Author_id == a.Id && t.Book_id == b.Id) select a).ToList() }).ToList();


                var result = new
                {
                    Book = auth.Union(boo).GroupBy(n => new { n.Name }).Select(g => g.FirstOrDefault())

                };
                return Ok(result);
            }
        }
        // GET: api/Book/Name/file
        [Route("add/{name:minlength(0)}/{file:minlength(0)}")]
        public IHttpActionResult Get(string name, string file)
        {
            
            string img = "C: \\Users\\OlehX\\Desktop\\Implement - directory - file - browsing--master\\WebApiBooksAngularClient\\Books\\Images\\Car Hacks.jpg";
            string descr = "AZAZA";
            Book book = new Book { Name = name, Image = img, Description = descr, File = file };

            List<Author> authors = new List<Author>
            {
               new Author{Id = 0, Name = "Abuu", SName = "Sitkh" },
               new Author { Id = 1, Name = "Эрик", SName = "Фримен" }
            };
            
            using (var db = new BooksEntities())
            {
                
                if (!(from b in db.Book
                      where (b.Name.Equals(book.Name))
                      select b).Any())
                {
                    book.Id = (from b in db.Book select b.Id).ToList().Last() + 1;
                    db.Book.Add(book);
                    //пошук книг по автору
                    foreach (Author author in authors)
                    {
                        var temp = (from a in db.Author
                                    join t in db.Table on a.Id equals t.Author_id
                                    where (a.Name.Equals(author.Name) && a.SName.Equals(author.SName))
                                    select a.Id).FirstOrDefault();

                        if (temp != 0)
                        {
                            author.Id = temp;
                        }
                        else
                        {
                            author.Id = (from a in db.Author select a.Id).ToList().Last() + 1;
                            db.Author.Add(author);
                        }


                        db.Table.Add(new Table { Id = (from t in db.Table select t.Id).ToList().Last() + 1, Book_id = book.Id, Author_id = author.Id });
                        db.SaveChanges();
                    }

                }

            }
            return Get();
        }


        // POST: api/Book
        [Route("")]
        [HttpPost]
        public void Post([FromBody]BookModel book)
        {
             
            Book boo = new Book { Name = book.Name, Image = book.Image, Description = book.Description, File = book.File };

         /*    List<Author> authors = new List<Author>
             {
                new Author{Id = 0, Name = "Abuu", SName = "Sitkh" },
                new Author { Id = 1, Name = "Эрик", SName = "Фримен" }
             };*/
          
            using (var db = new BooksEntities())
            {

                if (!(from b in db.Book
                      where (b.Name.Equals(book.Name))
                      select b).Any())
                {
                    boo.Id = (from b in db.Book select b.Id).ToList().Last() + 1;
                    db.Book.Add(boo);
                    //пошук книг по автору
                     foreach (Author author in book.Authors)
                      {
                          var temp = (from a in db.Author
                                      join t in db.Table on a.Id equals t.Author_id
                                      where (a.Name.Equals(author.Name) && a.SName.Equals(author.SName))
                                      select a.Id).FirstOrDefault();

                          if (temp != 0)
                          {
                              author.Id = temp;
                          }
                          else
                          {
                              author.Id = (from a in db.Author select a.Id).ToList().Last() + 1;
                              db.Author.Add(author);
                          }


                          db.Table.Add(new Table { Id = (from t in db.Table select t.Id).ToList().Last() + 1, Book_id = boo.Id, Author_id = author.Id });
                          db.SaveChanges();
                      }
                      
                }

            }
          
        }

        // PUT: api/Book/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE: api/Book/5
        public void Delete(int id)
        {
        }
    }
}
