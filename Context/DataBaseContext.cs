using Microsoft.EntityFrameworkCore;

namespace GuardarOrdenListado.Context
{
    public class DataBaseContext : DbContext
    {
        public DataBaseContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<Users> Users => Set<Users>();
        public DbSet<Authors> Authors => Set<Authors>();
        public DbSet<Books> Books => Set<Books>();
        public DbSet<DataLists> DataLists => Set<DataLists>();
        public DbSet<OrderLists> OrderLists => Set<OrderLists>();
    }
}
