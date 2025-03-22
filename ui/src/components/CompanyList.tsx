import Link from "next/link";

type Company = {
  id?: number;
  company?: number;
  name?: string;
  developer?: boolean;
  publisher?: boolean;
  url?: string;
};

export default function CompanyList({
  companies,
  invovledCompanies,
  isDeveloper,
}: {
  companies: Company[];
  invovledCompanies: Company[];
  isDeveloper: boolean;
}) {
  const separateDevAndPublishers = (companies: Company[]) => {
    const developers: Partial<Company>[] = [];
    const publishers: Partial<Company>[] = [];

    companies?.forEach((company: Company) => {
      if (company?.developer) {
        developers.push({
          id: company.id,
          url: company.url,
          name: company.name,
        });
      }

      if (company?.publisher) {
        publishers.push({
          id: company.id,
          url: company.url,
          name: company.name,
        });
      }
    });

    return {
      developers: developers,
      publishers: publishers,
    };
  };

  const buildCompanyList = (): Omit<Company, "company">[] =>
    invovledCompanies?.map((company: Company) => {
      //** company.company is the actual ID of the company in the API
      //** Using this company.company we are fetching the name and other details of the companies from compDetails
      const compDetails: Company | undefined = companies?.find(
        (compInfo: Company) => compInfo.id === company.company
      );

      return {
        id: compDetails?.id,
        name: compDetails?.name,
        url: compDetails?.url,
        developer: company?.developer,
        publisher: company?.publisher,
      };
    });

  const displayCompanyListItems = (isDeveloper: boolean) => {
    const { developers, publishers } = separateDevAndPublishers(
      buildCompanyList()
    );
    const list: Partial<Company>[] = [];
    isDeveloper ? list.push(developers[0]) : list.push(...publishers);

    return (
      <div className="block">
        {list && list.length > 0 ? (
          list.map((company: Partial<Company>, i: number) => {
            return company ? (
              <div className="text inline font-semibold" key={company.id}>
                <Link
                  className={`tracking-tight hover:underline whitespace-pre-wrap ${
                    company.url && `hover:text-blue-500`
                  }`}
                  href={`${company.url}`}
                >
                  {company.name}
                </Link>
                {i !== list.length - 1 ? "," + " " : ""}
              </div>
            ) : (
              <span className="text tracking-tight" key={i}>
                Information unavailable
              </span>
            );
          })
        ) : (
          <span className="text tracking-tight">Information unavailable</span>
        )}
      </div>
    );
  };

  return (
    <>
      <p className="text-gray-400 text-xl font-semibold block mb-1">
        {isDeveloper ? "Developers" : "Publishers"}
      </p>
      <div className="text-xl">{displayCompanyListItems(isDeveloper)}</div>
    </>
  );
}
