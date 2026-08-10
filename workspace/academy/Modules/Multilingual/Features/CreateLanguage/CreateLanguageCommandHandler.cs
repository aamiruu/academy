using academy.Data;
using academy.Modules.Multilingual.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;

namespace academy.Modules.Multilingual.Features.CreateLanguage
{
    public class CreateLanguageCommandHandler : IRequestHandler<CreateLanguageCommand, bool>
    {
        private readonly AcademyContext _context;

        public CreateLanguageCommandHandler(AcademyContext context)
        {
            _context = context;
        }

        public async Task<bool> Handle(CreateLanguageCommand request, CancellationToken cancellationToken)
        {
            if (await _context.Languages.AnyAsync(l => l.Code == request.Code, cancellationToken))
            {
                return false; // Language code already exists
            }

            if (request.IsDefault)
            {
                var existingDefaults = await _context.Languages.Where(l => l.IsDefault).ToListAsync(cancellationToken);
                foreach (var lang in existingDefaults)
                {
                    lang.IsDefault = false;
                }
            }

            var newLanguage = new Language
            {
                Code = request.Code,
                DisplayName = request.DisplayName,
                Direction = request.Direction,
                IsDefault = request.IsDefault,
                IsActive = request.IsActive
            };

            _context.Languages.Add(newLanguage);
            await _context.SaveChangesAsync(cancellationToken);

            return true;
        }
    }
}
