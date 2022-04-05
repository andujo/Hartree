using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Hartree.Model.Dto;
using YahooFinanceApi;

namespace Hartree.Services
{
    public interface ICoreService
    {
        Task<List<Candle>> GetFromYahooAsync(string ticker);

        List<GraphPointDto> CalculateResultAsync(decimal leftPoint, decimal rightPoint, List<Candle> yahooData);
    }

    public class CoreService : ICoreService
    {
        private readonly IMapper _mapper;

        public CoreService(IMapper mapper)
        {
            _mapper = mapper;
        }
        
       /// <summary>
       ///  Calculates the output based on the left and right point and the informationr etrieved from Yahoo.
       /// </summary>
       /// <param name="leftPoint">Left graph starting point-</param>
       /// <param name="rightPoint">Right graph ending point-</param>
       /// <param name="yahooData">The list of information from Yahoo.</param>
       /// <returns>A list of GraphPointDto</returns>
        public List<GraphPointDto> CalculateResultAsync(decimal leftPoint, decimal rightPoint, List<Candle> yahooData)
        {          
            var variation = CalculateVariation(yahooData.Count, yahooData.First().Close, yahooData.Last().Close, leftPoint, rightPoint);

            List<GraphPointDto> result = new List<GraphPointDto>();

            foreach (var data in yahooData)
            {
                result.Add(new GraphPointDto()
                {
                    TimeLine = data.DateTime,
                    Value = data.Close + variation[yahooData.IndexOf(data)]
                });
            }

            return result;
        }
        
       /// <summary>
       ///  Returns information from yahoo services.
       /// </summary>
       /// <param name="ticker">The ticker to be searched</param>
       /// <returns>A list of Candle objects</returns>/// <summary>
        /// 
        /// </summary>
        public async Task<List<Candle>> GetFromYahooAsync(string ticker) {
            List<Candle> yahooData = new List<Candle>();
            try
            {
                // Retrieve information from Yahoo Finance
                yahooData = (List<Candle>)await Yahoo.GetHistoricalAsync(ticker, DateTime.Today.AddDays(-366), DateTime.Today.AddDays(-1), Period.Monthly);
            }
            catch (Exception e)
            {
                // Log error
                Console.WriteLine(e.Message);
            }
            return yahooData;
        }
 /// <sumary>
        ///  Returns information from yahoo ices.
        /// </summarythe list of variance recult
       /// <param name="tmonths>TNumber of months./param>
        /// <param name="firstInput">First record from yahoo.</param>
        /// <param name="lastInput">Last record from yahoo.</param>
        /// <param name="leftPoint">Left starting point.</param>
        /// <param name="rightPoint">Right ending point.</param>
        /// <returns>A list of decimals</returns>
         /// <summary>
        /// This property always returns a value &lt; 1.
        /// </summary>
        private List<decimal> CalculateVariation(int months, decimal firstInput, decimal lastInput, decimal leftPoint, decimal rightPoint) 
        {
            List<decimal> variation = new List<decimal>();
            variation.Add(leftPoint - firstInput);

            var increment = (((rightPoint - firstInput) - (leftPoint - lastInput)) / (months - 1));
            for (int i = 1; i < months - 1; i++)
            {
                variation.Add((rightPoint - firstInput) + increment * i);
            }
            variation.Add(rightPoint - lastInput);

            return variation;
        }
    }
}