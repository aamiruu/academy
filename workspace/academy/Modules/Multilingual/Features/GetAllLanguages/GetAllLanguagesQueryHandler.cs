using academy.Data;
using academy.Modules.Multilingual.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace academy.Modules.Multilingual.Features.GetAllLanguages
{
    public class GetAllLanguagesQueryHandler : IRequestHandler<GetAllLanguagesQuery, IEnumerable<Language>>
    {
        private readonly AcademyContext _context;

        public GetAllLanguagesQueryHandler(AcademyContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Language>> Handle(GetAllLanguagesQuery request, CancellationToken cancellationToken)
        {
            return await _context.Languages.ToListAsync(cancellationToken);
        }
    }
}
