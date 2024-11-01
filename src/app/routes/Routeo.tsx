import { lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Welcome } from '../contenedor/Welcome';
import { Header } from '../contenedor/Header';
import { Error } from '../contenedor/Error';
import { EpisodeComponent } from '../components/EpisodeComponent';
import { SpecificEpisode } from '../components/SpecificEpisode';
import { CharacterComponent } from '../components/CharacterComponent';
import { SpecificCharacter } from '../components/SpecificCharacter';
import { LocationComponent } from '../components/LocationComponent';
import { SpecificLocation } from '../components/SpecificLocation';

const LazyWelcome = lazy(() => import('../contenedor/Welcome').then(() => ({ default: Welcome })));
const LazyError = lazy(() => import('../contenedor/Error').then(() => ({ default: Error })));
const LazyEpisode = lazy(() => import('../components/EpisodeComponent').then(() => ({ default: EpisodeComponent })));
const LazyEpisodeSpecific = lazy(() => import('../components/SpecificEpisode').then(() => ({ default: SpecificEpisode })));
const LazyCharacter = lazy(() => import('../components/CharacterComponent').then(() => ({ default: CharacterComponent })));
const LazySpecificCharacter = lazy(() => import('../components/SpecificCharacter').then(() => ({ default: SpecificCharacter })));
const LazyLocation = lazy(() => import('../components/LocationComponent').then(() => ({ default: LocationComponent })));
const LazySpecificLocation = lazy(() => import('../components/SpecificLocation').then(() => ({ default: SpecificLocation })));

export const Routeo = () => {
    return (
        <Routes>
            <Route path="/" element={<LazyWelcome />} />
            <Route path="*" element={<LazyError />} />
            <Route path="/episode" element={<LazyEpisode />} />
            <Route path="/episode/:id" element={<LazyEpisodeSpecific />} /> {/* Rutas para episodios específicos */}
            <Route path="/characters" element={<LazyCharacter />} />
            <Route path="/characters/:id" element={<LazySpecificCharacter />} /> {/* Rutas para personajes específicos */}
            <Route path="/location" element={<LazyLocation />} />
            <Route path="/location/:locationId" element={<LazySpecificLocation />} /> {/* Rutas para personajes específicos */}
        </Routes>
    );
};
