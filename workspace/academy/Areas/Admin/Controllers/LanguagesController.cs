using academy.Modules.Multilingual.Entities;
using academy.Modules.Multilingual.Features.CreateLanguage;
using academy.Modules.Multilingual.Features.DeleteLanguage;
using academy.Modules.Multilingual.Features.GetAllLanguages;
using academy.Modules.Multilingual.Features.UpdateLanguage;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace academy.Areas.Admin.Controllers
{
    [Area("Admin")]
    [Authorize(Roles = "Admin")]
    public class LanguagesController : Controller
    {
        private readonly IMediator _mediator;

        public LanguagesController(IMediator mediator)
        {
            _mediator = mediator;
        }

        public async Task<IActionResult> Index()
        {
            var languages = await _mediator.Send(new GetAllLanguagesQuery());
            return View(languages);
        }

        public IActionResult Create()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(Language language)
        {
            if (ModelState.IsValid)
            {
                await _mediator.Send(new CreateLanguageCommand(language.Code, language.DisplayName, language.Direction, language.IsDefault, language.IsActive));
                return RedirectToAction(nameof(Index));
            }
            return View(language);
        }

        public async Task<IActionResult> Edit(int id)
        {
            var languages = await _mediator.Send(new GetAllLanguagesQuery());
            var language = languages.FirstOrDefault(l => l.Id == id);
            if (language == null) return NotFound();
            return View(language);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, Language language)
        {
            if (id != language.Id) return NotFound();

            if (ModelState.IsValid)
            {
                await _mediator.Send(new UpdateLanguageCommand(language.Id, language.Code, language.DisplayName, language.Direction, language.IsDefault, language.IsActive));
                return RedirectToAction(nameof(Index));
            }
            return View(language);
        }

        public async Task<IActionResult> Delete(int id)
        {
            await _mediator.Send(new DeleteLanguageCommand(id));
            return RedirectToAction(nameof(Index));
        }
    }
}
