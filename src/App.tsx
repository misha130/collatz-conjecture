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
      <Hero />

      <SectionMarker label="The rule" note="Two operations" />
      <Section
        id="rule"
        title={<>Two operations define <Accent>the whole rule.</Accent></>}
        lede="n even → n/2. n odd → 3n + 1. No third case, no exception for size, and nothing about the two formulas suggests where the sequence should end."
      >
        <RuleExplainer />
      </Section>

      <SectionMarker label="Explorer" note="Any integer" />
      <Section
        id="explorer"
        title={<>Compute the sequence <Accent>for any n.</Accent></>}
        lede="Total stopping time, peak value, and the count of each step type — for a seed you choose, or one of the sequences below."
      >
        <HailstoneExplorer />
      </Section>

      <SectionMarker label="The coral" note="Interactive map" />
      <Section
        id="map"
        title={<>Every number, <Accent>one structure.</Accent></>}
        lede="Run the rule backwards from 1: predecessors of m are 2m, and (m − 1)/3 when that's a positive odd integer. Every reachable number branches off this graph. Rotating each branch by a fixed angle turns the plain directed graph into the shape below."
      >
        <CoralMap />
      </Section>

      <SectionMarker label="Statistics" note="Computed live" />
      <Section
        id="statistics"
        title={<>Downward drift, <Accent>on average.</Accent></>}
        lede="Odd steps triple a number; even steps halve it. But every odd step is immediately followed by at least one even step, so the geometric-mean change per odd number is 3/4 — under 1. That's computed below, not asserted."
      >
        <div class="mt-10">
          <RecordsStats />
        </div>
        <div class="mt-8 grid gap-8 xl:grid-cols-2">
          <PeakScatter />
          <BenfordChart />
        </div>
        <StepsFormula />
      </Section>

      <SectionMarker label="Why it's hard" note="Still open" />
      <Section
        id="unsolved"
        title={<>No proof exists <Accent>for all n.</Accent></>}
        lede="Every integer checked so far — up to 2^71 — reaches 1. No proof rules out a counterexample beyond that bound. Here is exactly what such a counterexample would have to look like, and how far the partial results get."
      >
        <OpenQuestions />
        <ProofProgress />
        <NamesGrid />
      </Section>

      <Footer />
    </div>
  );
}
