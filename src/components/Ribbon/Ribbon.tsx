import React, { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { HomeTab } from './HomeTab';
import { InsertTab } from './InsertTab';
import { LayoutTab } from './LayoutTab';
import { ReferencesTab } from './ReferencesTab';
import { MailingsTab } from './MailingsTab';
import { ReviewTab } from './ReviewTab';
import { ViewTab } from './ViewTab';
import { DrawTab } from './DrawTab';
import { DesignTab } from './DesignTab';
import { HelpTab } from './HelpTab';

export type RibbonTabType =
  | 'home'
  | 'insert'
  | 'layout'
  | 'references'
  | 'mailings'
  | 'review'
  | 'view'
  | 'draw'
  | 'design'
  | 'help';

interface RibbonProps {
  onOpenFileMenu: () => void;
  activeTab: RibbonTabType;
  onChangeTab: (tab: RibbonTabType) => void;

  // Pass-through props for tab panels
  homeProps: React.ComponentProps<typeof HomeTab>;
  insertProps: React.ComponentProps<typeof InsertTab>;
  layoutProps: React.ComponentProps<typeof LayoutTab>;
  referencesProps: React.ComponentProps<typeof ReferencesTab>;
  mailingsProps: React.ComponentProps<typeof MailingsTab>;
  reviewProps: React.ComponentProps<typeof ReviewTab>;
  viewProps: React.ComponentProps<typeof ViewTab>;
  drawProps: React.ComponentProps<typeof DrawTab>;
  designProps: React.ComponentProps<typeof DesignTab>;
  helpProps: React.ComponentProps<typeof HelpTab>;
}

export const Ribbon: React.FC<RibbonProps> = ({
  onOpenFileMenu,
  activeTab,
  onChangeTab,
  homeProps,
  insertProps,
  layoutProps,
  referencesProps,
  mailingsProps,
  reviewProps,
  viewProps,
  drawProps,
  designProps,
  helpProps,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const TABS: { id: RibbonTabType; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'insert', label: 'Insert' },
    { id: 'layout', label: 'Layout' },
    { id: 'references', label: 'References' },
    { id: 'mailings', label: 'Mailings' },
    { id: 'review', label: 'Review' },
    { id: 'view', label: 'View' },
    { id: 'draw', label: 'Draw' },
    { id: 'design', label: 'Design' },
    { id: 'help', label: 'Help' },
  ];

  return (
    <div className="bg-[#f3f2f1] border-b border-slate-300 shadow-xs flex flex-col shrink-0 select-none">
      {/* 1. Ribbon Tabs Header Bar */}
      <div className="flex items-center justify-between px-3 h-8 border-b border-slate-200 text-xs">
        <div className="flex items-center h-full">
          {/* File Tab Button */}
          <button
            onClick={onOpenFileMenu}
            className="px-4 h-full bg-[#185abd] hover:bg-[#104a9e] text-white font-semibold transition-colors flex items-center justify-center mr-1"
          >
            File
          </button>

          {/* Standard Tabs */}
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  onChangeTab(tab.id);
                  if (isCollapsed) setIsCollapsed(false);
                }}
                className={`px-3 h-full font-medium transition-colors relative flex items-center ${
                  isActive
                    ? 'text-[#2b579a] font-semibold bg-white border-t-2 border-t-[#2b579a]'
                    : 'text-slate-700 hover:bg-slate-200/60'
                }`}
              >
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Ribbon Pin / Collapse Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 hover:bg-slate-200 text-slate-500 rounded"
          title={isCollapsed ? 'Pin the ribbon' : 'Collapse the ribbon'}
        >
          {isCollapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* 2. Active Tab Toolbar Panel */}
      {!isCollapsed && (
        <div className="h-24 bg-white px-2 py-1 flex items-stretch border-b border-slate-200 shadow-2xs">
          {activeTab === 'home' && <HomeTab {...homeProps} />}
          {activeTab === 'insert' && <InsertTab {...insertProps} />}
          {activeTab === 'layout' && <LayoutTab {...layoutProps} />}
          {activeTab === 'references' && <ReferencesTab {...referencesProps} />}
          {activeTab === 'mailings' && <MailingsTab {...mailingsProps} />}
          {activeTab === 'review' && <ReviewTab {...reviewProps} />}
          {activeTab === 'view' && <ViewTab {...viewProps} />}
          {activeTab === 'draw' && <DrawTab {...drawProps} />}
          {activeTab === 'design' && <DesignTab {...designProps} />}
          {activeTab === 'help' && <HelpTab {...helpProps} />}
        </div>
      )}
    </div>
  );
};
