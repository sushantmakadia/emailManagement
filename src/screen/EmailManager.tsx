import React, { JSX, useState } from "react";
import { Input, Button, Card, Checkbox, Collapse } from "antd";
import { CloseCircleOutlined } from "@ant-design/icons";
import { EmailCollapseContainer, EmailListItems, MainContainer } from "./EmailManagerStyled";


const initialRecipients: string[] = [
    "brian@qwerty.com",
    "james@qwerty.com",
    "jane@awesome.com",
    "kate@qwerty.com",
    "mike@hello.com",
    "abc@gmail.com",
];

const companySuggestions: string[] = initialRecipients.map((item) => item.split("@")[1]);

const { Panel } = Collapse;
const EmailManager= ():JSX.Element => {
  const [recipients, setRecipients] = useState<string[]>(initialRecipients);
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([]);
  const [search, setSearch] = useState<string>("");

  const groupedRecipients: Record<string, string[]> = recipients.reduce((acc: Record<string, string[]>, email: string) => {
    const domain = email.split("@")[1];
    if (!acc[domain]) acc[domain] = [];
    acc[domain].push(email);
    return acc;
  }, {});

  const filteredRecipients = recipients.filter((email) => email.includes(search));
  const filteredGroupedRecipients: Record<string, string[]> = filteredRecipients.reduce(
    (acc: Record<string, string[]>, email: string) => {
      const domain = email.split("@")[1];
      if (!acc[domain]) acc[domain] = [];
      acc[domain].push(email);
      return acc;
    },
    {}
  );

  const handleSelect = (email: string) => {
    setSelectedRecipients((prev) =>
      prev.includes(email) ? prev.filter((e) => e !== email) : [...prev, email]
    );
  };

  const handleSelectDomain = (domain: string) => {
    const domainEmails = groupedRecipients[domain] || [];
    const allSelected = domainEmails.every((email) => selectedRecipients.includes(email));
    setSelectedRecipients((prev) =>
      allSelected ? prev.filter((email) => !domainEmails.includes(email)) : [...prev, ...domainEmails.filter((email) => !prev.includes(email))]
    );
  };

  const handleRemoveDomain = (domain: string) => {
    setSelectedRecipients((prev) => prev.filter((email) => !groupedRecipients[domain]?.includes(email)));
  };

  const handleAddRecipient = () => {
    if (search.includes("@") && /^[^@]+@[^@]+\.[^@]+$/.test(search)) {
      if (!recipients.includes(search)) {
        setRecipients((prev) => [...prev, search]);
      }
    } else if (companySuggestions.includes(search)) {
      setRecipients((prev) => [...prev, `newuser@${search}`]);
    }
    setSearch("");
  };

  return (
    <MainContainer>
      <Card title="Available Recipients" style={{ flex: 1 }}>
        <Input
          className="search-input"
          value={search}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
          placeholder="Search or enter email"
        />
        {!recipients.includes(search) && search && /^[^@]+@[^@]+\.[^@]+$/.test(search) && (
          <Button type="primary" onClick={handleAddRecipient}>
            Add {search}
          </Button>
        )}
        {Object.entries(filteredGroupedRecipients).map(([domain, emails]) =>
          emails.length === 1 ? (
            <EmailListItems key={emails[0]}>
              <Checkbox
                checked={selectedRecipients.includes(emails[0])}
                onChange={() => handleSelect(emails[0])}
                data-testid={`checkbox-${emails[0]}`}
              />
              {emails[0]}
            </EmailListItems>
          ) : (
            <EmailCollapseContainer key={domain} expandIconPosition="right">
              <Panel
                key={domain}
                header={
                  <EmailListItems>
                    <Checkbox
                      checked={emails.every((email) => selectedRecipients.includes(email))}
                      onChange={() => handleSelectDomain(domain)}
                      data-testid={`checkbox-${domain}`}
                    />
                    <strong>{domain}</strong>
                  </EmailListItems>
                }
              >
                {emails.map((email) => (
                  <EmailListItems key={email}>
                    <Checkbox
                      checked={selectedRecipients.includes(email)}
                      onChange={() => handleSelect(email)}
                      data-testid={`checkbox-${email}`}
                    />
                    {email}
                  </EmailListItems>
                ))}
              </Panel>
            </EmailCollapseContainer>
          )
        )}
      </Card>

      <Card title="Selected Recipients" style={{ flex: 1 }}>
        <EmailCollapseContainer expandIconPosition="right">
          {selectedRecipients.length > 0 && (
            <Panel header={<strong data-testid="company-recipients-collapse">Company Recipients</strong>} key={"company-recipients"}>
              {Object.keys(groupedRecipients).map(
                (domain) =>
                  selectedRecipients.some((email) => email.endsWith(`@${domain}`) && groupedRecipients[domain].length > 1) && (
                    <div key={domain} className="grouped-email">
                      <strong>{domain}</strong>{" "}
                      <Button type="text" danger onClick={() => handleRemoveDomain(domain)}>
                        Remove All
                      </Button>
                      {selectedRecipients
                        .filter((email) => email.endsWith(`@${domain}`))
                        .map((email) => (
                          <EmailListItems key={email}>
                            {email}{" "}
                            <Button type="text" icon={<CloseCircleOutlined />} onClick={() => handleSelect(email)} />
                          </EmailListItems>
                        ))}
                    </div>
                  )
              )}
            </Panel>
          )}

          {selectedRecipients.length > 0 && (
            <Panel header={<strong data-testid="email-recipients-collapse">Email Recipients</strong>}  key={"email-recipients"}>
              {selectedRecipients
                .filter((email) => groupedRecipients[email.split("@")[1]].length === 1)
                .map((email) => (
                  <EmailListItems key={email}>
                    {email} <Button type="text" icon={<CloseCircleOutlined />} onClick={() => handleSelect(email)} />
                  </EmailListItems>
                ))}
            </Panel>
          )}
        </EmailCollapseContainer>
      </Card>
    </MainContainer>
  );
};

export default EmailManager;
