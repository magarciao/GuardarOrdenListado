using System.ComponentModel.DataAnnotations;

namespace GuardarOrdenListado.Context
{
    public class Users
    {
        public int Id { get; set; }

        [Display(Name = "Nombre del Usuario")]
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? eMail { get; set; }
    }
}
