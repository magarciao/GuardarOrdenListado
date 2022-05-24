using System.ComponentModel.DataAnnotations.Schema;

namespace GuardarOrdenListado.Context
{
    public class Books
    {
        public int Id { get; set; }
        public int IdAuthor { get; set; }
        public string NameBook { get; set; }

        [NotMapped]
        public int Sort { get; set; }
    }
}
