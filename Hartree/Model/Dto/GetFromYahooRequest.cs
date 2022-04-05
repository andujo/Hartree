namespace Hartree.Model.Dto
{
    public class GetFromYahooRequest
    {
        public decimal LeftPoint { get; set; }

        public decimal RightPoint { get; set; }

        public string Ticker { get; set; }
    }
}
