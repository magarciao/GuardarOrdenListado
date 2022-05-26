using GuardarOrdenListado.Context;
using GuardarOrdenListado.Models;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;

namespace GuardarOrdenListado.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly DataBaseContext dbContext;

        public HomeController(ILogger<HomeController> logger, DataBaseContext dbContext)
        {
            _logger = logger;
            this.dbContext = dbContext;
        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }

        public async Task<IActionResult> ListUsers()
        {
            List<Users> users = await Task.FromResult(dbContext.Users.ToList());

            return View(users);
        }

        public async Task<IActionResult> ListAuthors(int IdUser, string UserName)
        {
            List<Authors> authors = await Task.FromResult(dbContext.Authors.ToList());

            ListOrderedForUser listOrderedForUser = new ListOrderedForUser($"1,{IdUser}", authors, "Id", null, dbContext);

            HttpContext.Session.SetInt32("IdUser", IdUser);
            HttpContext.Session.SetString("UserName", UserName);
            ViewBag.IdUser = IdUser;
            ViewBag.UserName = UserName;

            return View(authors.OrderBy(x => x.Sort).ToList());
        }

        public async Task<IActionResult> ListBooks(int IdAuthor)
        {
            int IdUser = Convert.ToInt32(HttpContext.Session.GetInt32("IdUser"));

            List<Books> books = await Task.FromResult(dbContext.Books.Where(x => x.IdAuthor == IdAuthor).ToList());

            ListOrderedForUser listOrderedForUser = new ListOrderedForUser($"2,{IdUser},{IdAuthor}", books, "Id", null, dbContext);

            Authors? authors = await dbContext.Authors.FindAsync(IdAuthor);

            ViewBag.IdUser = IdUser;
            ViewBag.UserName = HttpContext.Session.GetString("UserName");
            ViewBag.IdAuthor = IdAuthor;
            ViewBag.AuthorName = authors.NameAuthor;

            return View(books.OrderBy(x => x.Sort).ToList());
        }

        [HttpPost]
        public async Task<IActionResult> ResgisterList([FromBody] NewOrderList data)
        {
            ListOrderedForUser listOrderedForUser = new ListOrderedForUser(data.keyList, null, null, data.orderItems, dbContext);
            return View();
        }
    }
}