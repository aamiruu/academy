using Microsoft.AspNetCore.Mvc;
using academy.Modules.Multilingual.Services;
using System.Threading.Tasks;

namespace academy.ViewComponents
{
    public class LanguageSwitcherViewComponent : ViewComponent
    {
        private readonly LanguageService _languageService;

        public LanguageSwitcherViewComponent(LanguageService languageService)
        {
            _languageService = languageService;
        }

        public async Task<IViewComponentResult> InvokeAsync()
        {
            var languages = await _languageService.GetAllActiveLanguagesAsync();
            var currentCulture = HttpContext.Features.Get<Microsoft.AspNetCore.Localization.IRequestCultureFeature>()?.RequestCulture.Culture.Name ?? "fa-IR";

            var model = new academy.Modules.Multilingual.ViewModels.LanguageSwitcherViewModel
            {
                ActiveLanguages = languages,
                CurrentLanguageCode = currentCulture
            };

            return View(model);
        }
    }
}
