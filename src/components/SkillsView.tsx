import React from 'react';
import { PageView } from '../types';
import { useLang } from '../i18n/LangContext';
import { SKILL_CATEGORIES, SOFT_SKILLS } from '../data/skillsData';

interface SkillsViewProps {
  onNavigate: (view: PageView, hash?: string) => void;
}

export const SkillsView: React.FC<SkillsViewProps> = ({ onNavigate }) => {
  const { t, lang } = useLang();
  const s = t.skillsPage;

  return (
    <div id="view-skills" className="page-view skills-page">
      <section className="skills-page-section">
        <header className="skills-page-header animate-on-scroll">
          <h1 className="skills-page-title">
            {s.title}<span className="dot">.</span>
          </h1>
          <p className="skills-page-subtitle">{s.subtitle}</p>
        </header>

        <h2 className="skills-section-heading animate-on-scroll">{s.technicalTitle}</h2>

        <div className="skills-categories">
          {SKILL_CATEGORIES.map((cat, ci) => (
            <div key={cat.id} className="skills-category animate-on-scroll" data-delay={String((ci % 4) + 1)}>
              <h3 className="skills-category-title">
                {lang === 'en' ? cat.titleEn : cat.title}
              </h3>
              <div className="skills-labels">
                {cat.skills.map((skill) => {
                  const Icon = skill.icon;
                  return (
                    <span key={skill.name} className="skill-label" title={lang === 'en' ? skill.levelEn : skill.level}>
                      {Icon ? (
                        <span className="skill-label-icon" style={{ color: skill.color }} aria-hidden="true">
                          <Icon />
                        </span>
                      ) : (
                        <span className="skill-label-dot" aria-hidden="true"></span>
                      )}
                      <span className="skill-label-name">{skill.name}</span>
                      <span className="skill-label-level">{lang === 'en' ? skill.levelEn : skill.level}</span>
                    </span>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <h2 className="skills-section-heading animate-on-scroll" style={{ marginTop: '64px' }}>
          {s.softTitle}
        </h2>
        <div className="soft-skills-list animate-on-scroll">
          {SOFT_SKILLS.map((soft, i) => (
            <div key={i} className="soft-skill-item">
              <span className="soft-skill-bullet" aria-hidden="true">✦</span>
              <span>{lang === 'en' ? soft.en : soft.es}</span>
            </div>
          ))}
        </div>

        <div className="skills-page-back">
          <a
            href="#hero"
            className="nav-return-home-btn"
            style={{ color: '#682ae9', fontWeight: 700, textDecoration: 'none' }}
            onClick={(e) => {
              e.preventDefault();
              onNavigate('home', '#hero');
            }}
          >
            &larr; {t.work.backHome}
          </a>
        </div>
      </section>
    </div>
  );
};
