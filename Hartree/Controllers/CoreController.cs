using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Hartree.Services;
using Microsoft.AspNetCore.Mvc;
using Hartree.Model.Dto;
using System.Linq;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace Hartree.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class CoreController : ControllerBase
	{

		private readonly ILogger<CoreController> _logger;
		private readonly ICoreService _coreService;

		public CoreController(ILogger<CoreController> logger, ICoreService coreService)
		{
			_logger = logger;
			_coreService = coreService;
		}

        [HttpPost("PostYahoo")]
        public async Task<IActionResult> PostYahooAsync([FromBody] GetFromYahooRequest request)
        {
            if (ModelState.IsValid)
            {
                var yahooResult = await _coreService.GetFromYahooAsync(request.Ticker).ConfigureAwait(false);
                if (yahooResult != null)
                {
                    decimal first = yahooResult.First().Close;
                    decimal last = yahooResult.Last().Close;
                 
                    if (request.LeftPoint < first) 
                    {
                        ModelState.TryAddModelError(nameof(request.LeftPoint), "Left point should be bigger than first graph amount");
                    }
                    if (request.RightPoint < last) 
                    {
                        ModelState.TryAddModelError(nameof(request.RightPoint), "Right point should be bigger than last graph amount");
                    }

                    if (ModelState.ErrorCount > 0)
                    {
                        return BadRequest();
                    }

                    var result = _coreService.CalculateResultAsync(request.LeftPoint, request.RightPoint, yahooResult);
                    if (result != null)
                    {
                        return Ok(result);
                    }
                }

                return NotFound();
            }

            _logger.LogWarning("PostYahooAsync bad request");
            return BadRequest();
        }

        [HttpGet("GetYahoo")]
        public async Task<IActionResult> GetYahooAsync([FromQuery] string ticker)
        {
            if (ModelState.IsValid)
            {
                var result = await _coreService.GetFromYahooAsync(ticker).ConfigureAwait(false);
                if (result != null)
                {
                    return Ok(result);
                }

                return NotFound();
            }

            _logger.LogWarning("GetYahooAsync bad request");
            return BadRequest();
        }
    }
}
