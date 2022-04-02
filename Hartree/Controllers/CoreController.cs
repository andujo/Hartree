using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Model.Dto;
using Hartree.Services;
using Microsoft.AspNetCore.Mvc;

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

		[HttpGet]
		public async Task<IActionResult> GetAllAsync()
		{
			return Ok(await _coreService.GetCore(67));
		}
	}
}
