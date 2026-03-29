import { ParagraphText } from '@/Components/Typography';

function EnterpriseSurveyMethodology() {
  return (
    <ParagraphText>
      The World Bank Enterprise Surveys (WBES) provide firm-level data on the
      business environment and its interaction with enterprise performance. They
      are implemented by the World Bank, usually through local partners,
      following a harmonised global methodology that ensures results are
      comparable across countries and over time.
      <br />
      <br />
      The surveys cover the formal private sector only, excluding the informal
      economy, agriculture, extractive industries, and public sector
      organisations including also public enterprises. The target population
      consists of registered business establishments with at least five
      employees. Samples are drawn through stratified random selection, with
      strata defined by firm size, main activity, and region. The respondent for
      the WBES is a top-level decision maker (owner, director, etc.) of the
      establishment sampled.
      <br />
      <br />
      The WBES questionnaire is standardised across all participating countries
      and consists mainly of factual items answered by the owner or top manager
      of the business establishment. It covers more than a dozen thematic
      areas—such as access to finance, infrastructure, trade, regulation,
      innovation, and labour practices—also including questions on corruption.
      Around ninety percent of questions are factual, while a small subset
      captures perceptions. Interviews are conducted face-to-face, most recently
      through computer-assisted personal interviewing (CAPI). Corruption-related
      questions of the WBES clarify bribery pressure as experienced by sampled
      business establishments in various contexts (taxation, procurement,
      permits/licences and access to utility services), and include an
      assessment of how much of a burden corruption is in the particular economy
      for the business establishment interviewed.
      <br />
      <br />
      Data is collected through in-person interviewing, implementing rigorous
      controls through extensive field supervision, back-checks, and internal
      validation by the World Bank team.
      <br />
      <br />
      All microdata, questionnaires, and methodological notes are publicly
      available at{' '}
      <a
        href='https://www.enterprisesurveys.org'
        target='_blank'
        rel='noreferrer'
        className='underline poppins-semibold'
      >
        www.enterprisesurveys.org
      </a>
      .
    </ParagraphText>
  );
}

export default EnterpriseSurveyMethodology;
