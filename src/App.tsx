import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Section from "./components/Section";
import SectionMarker from "./components/SectionMarker";
import RuleExplainer from "./components/RuleExplainer";
import HailstoneExplorer from "./components/HailstoneExplorer";
import CoralMap from "./components/CoralMap";
import RecordsStats from "./components/RecordsStats";
import PeakScatter from "./components/PeakScatter";
import BenfordChart from "./components/BenfordChart";
import OpenQuestions from "./components/OpenQuestions";
import ProofProgress from "./components/ProofProgress";
import NamesGrid from "./components/NamesGrid";
import StepsFormula from "./components/StepsFormula";
import Footer from "./components/Footer";
import Accent from "./components/Accent";

export default function App() {
  return (
    <div class="min-h-screen">
      <Nav />
      <main>
        <Hero />

        <SectionMarker label="The rule" note="Two operations" />
        <Section
          id="rule"
          title={<>The rule has <Accent>two steps.</Accent></>}
          lede="If n is even, halve it. If n is odd, triple it and add one. Then repeat."
        >
          <RuleExplainer />
        </Section>

        <SectionMarker label="Explorer" note="Positive or negative" />
        <Section
          id="explorer"
          title={<>Try a <Accent>starting number.</Accent></>}
          lede="See its trajectory, total stopping time, highest value, and step counts. The explorer accepts nonzero integers up to one billion in magnitude."
        >
          <HailstoneExplorer />
        </Section>

        <SectionMarker label="The coral" note="Interactive map" />
        <Section
          id="map"
          title={<>Trace the graph <Accent>backward.</Accent></>}
          lede="Starting at 1, each number m has the predecessor 2m. It also has (m − 1)/3 when that value is a positive odd integer. Fixed branch angles turn this reverse graph into the shape below."
        >
          <CoralMap />
        </Section>

        <SectionMarker label="Statistics" note="Computed live" />
        <Section
          id="statistics"
          title={<>What the sample <Accent>suggests.</Accent></>}
          lede="A random-parity model predicts a geometric-mean multiplier of 3/4 from one odd value to the next. This matches the general downward trend, but does not establish convergence."
        >
          <div class="mt-10">
            <RecordsStats />
          </div>
          <div class="mt-8 grid min-w-0 gap-8 xl:grid-cols-2">
            <PeakScatter />
            <BenfordChart />
          </div>
          <StepsFormula />
        </Section>

        <SectionMarker label="Why it's hard" note="Still open" />
        <Section
          id="unsolved"
          title={<>What has been proved <Accent>so far.</Accent></>}
          lede="Every integer checked up to 2^71 reaches 1. A counterexample beyond that limit has not been ruled out."
        >
          <OpenQuestions />
          <ProofProgress />
          <NamesGrid />
        </Section>
      </main>

      <Footer />
    </div>
  );
}
