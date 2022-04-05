using System;

namespace Model.Entities
{

    public class Cores
    {
        public decimal Id { get; set; }
        public string Build { get; set; }
        public string Name { get; set; }
        public string Schedule { get; set; }
        public string Webhooks { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}