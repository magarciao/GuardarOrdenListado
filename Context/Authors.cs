using System.ComponentModel.DataAnnotations.Schema;

namespace GuardarOrdenListado.Context
{
    public class Authors
    {
        public int Id { get; set; }
        public string NameAuthor { get; set; }

        [NotMapped]
        public int Sort { get; set; }
    }
}
